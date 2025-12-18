@Service
public class SleeperIngestService {

    @Autowired
    private PlayerRepository playerRepository;

    // This tells Spring to run this the second the app is ready
    @EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    @Scheduled(cron = "0 0 2 * * *")
    public void ingestSleeperPlayers() {
        System.out.println("🚀 Starting Sleeper Ingestion...");
        // ... rest of your code
    }
}   