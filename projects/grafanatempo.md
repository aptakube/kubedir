Grafana Tempo is an open source, easy-to-use and high-scale distributed tracing backend. Tempo is cost-efficient, requiring only object storage to operate, and is deeply integrated with Grafana, Prometheus, and Loki.

Tempo is Jaeger, Zipkin, Kafka, OpenCensus and OpenTelemetry compatible. It ingests batches in any of the mentioned formats, buffers them and then writes them to Azure, GCS, S3 or local disk. As such it is robust, cheap and easy to operate!

Tempo implements TraceQL, a traces-first query language inspired by LogQL and PromQL. This query language allows users to very precisely and easily select spans and jump directly to the spans fulfilling the specified conditions.
