import Foundation

struct TripCard: Identifiable, Equatable {
    let id: UUID
    let title: String
    let destination: String
    let hotelName: String
    let pricePerPerson: Int
    let nights: Int
    let departureLabel: String
    let airport: String
    let boardType: String
    let provider: String
    let matchReason: String
    let tags: [String]
    let highlights: [String]
    let bookingURL: URL
    let heroSystemImage: String

    init(
        id: UUID = UUID(),
        title: String,
        destination: String,
        hotelName: String,
        pricePerPerson: Int,
        nights: Int,
        departureLabel: String,
        airport: String,
        boardType: String,
        provider: String,
        matchReason: String,
        tags: [String],
        highlights: [String],
        bookingURL: URL,
        heroSystemImage: String
    ) {
        self.id = id
        self.title = title
        self.destination = destination
        self.hotelName = hotelName
        self.pricePerPerson = pricePerPerson
        self.nights = nights
        self.departureLabel = departureLabel
        self.airport = airport
        self.boardType = boardType
        self.provider = provider
        self.matchReason = matchReason
        self.tags = tags
        self.highlights = highlights
        self.bookingURL = bookingURL
        self.heroSystemImage = heroSystemImage
    }
}

extension TripCard {
    static let mockTrips: [TripCard] = [
        TripCard(
            title: "Adults only zonweek",
            destination: "Mallorca, Spanje",
            hotelName: "Cala Breeze Resort",
            pricePerPerson: 899,
            nights: 7,
            departureLabel: "Vertrek in juni",
            airport: "Schiphol",
            boardType: "All-inclusive",
            provider: "TUI",
            matchReason: "Rechtstreekse vlucht en binnen je budget",
            tags: ["Adults only", "Strand", "Rust"],
            highlights: ["Transfer inbegrepen", "4-sterren resort", "5 min van het strand"],
            bookingURL: URL(string: "https://www.tui.nl")!,
            heroSystemImage: "sun.max.fill"
        ),
        TripCard(
            title: "Budget zon break",
            destination: "Alanya, Turkije",
            hotelName: "Blue Pearl Hotel",
            pricePerPerson: 649,
            nights: 8,
            departureLabel: "Vertrek in september",
            airport: "Eindhoven",
            boardType: "Ultra all-inclusive",
            provider: "Sunweb",
            matchReason: "Goede prijs voor late summer sun",
            tags: ["Voordelig", "Zwembad", "Zonzeker"],
            highlights: ["Veel voor weinig", "Directe vlucht", "Gratis wifi"],
            bookingURL: URL(string: "https://www.sunweb.nl")!,
            heroSystemImage: "beach.umbrella.fill"
        ),
        TripCard(
            title: "Romantische escape",
            destination: "Santorini, Griekenland",
            hotelName: "Aegean Cliff Suites",
            pricePerPerson: 1299,
            nights: 6,
            departureLabel: "Vertrek in augustus",
            airport: "Dusseldorf",
            boardType: "Logies + ontbijt",
            provider: "TUI",
            matchReason: "Perfect voor een romantische week samen",
            tags: ["Romantisch", "Boutique", "Uitzicht"],
            highlights: ["Infinity pool", "Caldera view", "Adults preferred"],
            bookingURL: URL(string: "https://www.tui.nl")!,
            heroSystemImage: "heart.circle.fill"
        ),
        TripCard(
            title: "Familie all-in topdeal",
            destination: "Kos, Griekenland",
            hotelName: "Sunny Coast Family Club",
            pricePerPerson: 1049,
            nights: 8,
            departureLabel: "Vertrek in meivakantie",
            airport: "Schiphol",
            boardType: "All-inclusive",
            provider: "Sunweb",
            matchReason: "Kindvriendelijk met korte transfertijd",
            tags: ["Familie", "Kids club", "Waterpark"],
            highlights: ["Familiekamers", "Kinderbuffet", "Splash zone"],
            bookingURL: URL(string: "https://www.sunweb.nl")!,
            heroSystemImage: "figure.2.and.child.holdinghands"
        ),
        TripCard(
            title: "Luxe city + beach",
            destination: "Dubai, VAE",
            hotelName: "Harbor Lights Downtown",
            pricePerPerson: 1549,
            nights: 5,
            departureLabel: "Vertrek in november",
            airport: "Schiphol",
            boardType: "Halfpension",
            provider: "TUI",
            matchReason: "Luxe trip met zon in het najaar",
            tags: ["Luxe", "Stad", "Beach club"],
            highlights: ["Rooftop pool", "Centraal gelegen", "Premium kamers"],
            bookingURL: URL(string: "https://www.tui.nl")!,
            heroSystemImage: "building.2.crop.circle.fill"
        )
    ]
}
