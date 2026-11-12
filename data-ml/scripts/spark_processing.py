import json
from pathlib import Path
from pyspark.sql import SparkSession
from pyspark.sql.functions import avg, max as spark_max, count, round as spark_round

ROOT = Path(__file__).resolve().parents[1]
SOURCE = str(ROOT / "data" / "cloud_telemetry.csv")
OUTPUT = ROOT / "output"
OUTPUT.mkdir(parents=True, exist_ok=True)

spark = (
    SparkSession.builder
    .master("local[2]")
    .appName("CloudOpsBigDataAnalytics")
    .config("spark.ui.enabled", "false")
    .getOrCreate()
)
spark.sparkContext.setLogLevel("ERROR")

df = spark.read.option("header", True).option("inferSchema", True).csv(SOURCE)

print("INPUT RECORDS:", df.count())
print("INPUT COLUMNS:", len(df.columns))

df_clean = df.dropna().dropDuplicates()

summary = (
    df_clean.groupBy("service")
    .agg(
        count("*").alias("record_count"),
        spark_round(avg("cpu_usage"), 2).alias("avg_cpu"),
        spark_round(avg("memory_usage"), 2).alias("avg_memory"),
        spark_round(avg("api_latency_ms"), 2).alias("avg_latency_ms"),
        spark_round(spark_max("api_latency_ms"), 2).alias("max_latency_ms"),
        spark_round(avg("error_rate"), 2).alias("avg_error_rate")
    )
    .orderBy("service")
)

summary.show(truncate=False)

summary.coalesce(1).write.mode("overwrite").option("header", True).csv(
    str(OUTPUT / "spark_service_summary")
)

stats = {
    "input_records": df.count(),
    "clean_records": df_clean.count(),
    "services_analysed": df_clean.select("service").distinct().count(),
    "processing_engine": "Apache Spark",
    "execution_mode": "Local two-worker demonstration",
    "source": "Synthetic cloud telemetry dataset"
}

with (OUTPUT / "spark_summary.json").open("w") as f:
    json.dump(stats, f, indent=2)

spark.stop()
print("SPARK PROCESSING COMPLETED")
