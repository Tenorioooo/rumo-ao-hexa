export default function handler(req, res) {
  const logs = global.webhookLogs || [];
  return res.status(200).json({
    message: "Histórico de Webhooks Recentes (Memória Epêmera)",
    total_cached: logs.length,
    logs: logs
  });
}
