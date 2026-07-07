using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace TawqiApi.Services
{
    public class QueuedHostedService : BackgroundService
    {
        private readonly ILogger<QueuedHostedService> _logger;

        public QueuedHostedService(IBackgroundTaskQueue taskQueue, ILogger<QueuedHostedService> logger)
        {
            TaskQueue = taskQueue;
            _logger = logger;
        }

        public IBackgroundTaskQueue TaskQueue { get; }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Queued Hosted Service is running.");

            await BackgroundProcessing(stoppingToken);
        }

        private async Task BackgroundProcessing(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var workItem = await TaskQueue.DequeueAsync(stoppingToken);

                try
                {
                    // Adding a simple retry mechanism directly into the execution wrapper
                    // But actually, the retry logic should be inside the workItem itself if it needs specifics,
                    // or we can wrap the execution here. Since we pass the logic as a Func, we can retry the Func.
                    
                    int maxRetries = 3;
                    int delayMs = 2000;
                    
                    for (int attempt = 1; attempt <= maxRetries; attempt++)
                    {
                        try
                        {
                            await workItem(stoppingToken);
                            break; // Success
                        }
                        catch (Exception ex)
                        {
                            if (attempt == maxRetries)
                            {
                                _logger.LogError(ex, "Error occurred executing work item after {MaxRetries} attempts. Item is now abandoned.", maxRetries);
                            }
                            else
                            {
                                _logger.LogWarning(ex, "Error occurred executing work item on attempt {Attempt}. Retrying in {Delay}ms...", attempt, delayMs);
                                await Task.Delay(delayMs, stoppingToken);
                                // Exponential backoff
                                delayMs *= 2;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Critical Error executing background task.");
                }
            }
        }

        public override async Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Queued Hosted Service is stopping.");
            await base.StopAsync(stoppingToken);
        }
    }
}
