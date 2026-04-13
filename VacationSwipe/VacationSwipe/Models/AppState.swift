import Foundation

final class AppState: ObservableObject {
    @Published var hasCompletedOnboarding = false
    @Published var preferences = UserPreferences()
    @Published var availableTrips = TripCard.mockTrips
    @Published var favoriteTrips: [TripCard] = []
    @Published var dismissedTripIDs: Set<UUID> = []

    var remainingTrips: [TripCard] {
        availableTrips.filter { !dismissedTripIDs.contains($0.id) }
    }

    func completeOnboarding() {
        availableTrips = rankedTrips(for: preferences)
        hasCompletedOnboarding = true
    }

    func reject(_ trip: TripCard) {
        dismissedTripIDs.insert(trip.id)
    }

    func save(_ trip: TripCard) {
        dismissedTripIDs.insert(trip.id)
        guard !favoriteTrips.contains(trip) else { return }
        favoriteTrips.append(trip)
    }

    func resetDeck() {
        dismissedTripIDs.removeAll()
    }

    private func rankedTrips(for preferences: UserPreferences) -> [TripCard] {
        TripCard.mockTrips
            .map { trip in
                (trip: trip, score: score(for: trip, preferences: preferences))
            }
            .sorted { lhs, rhs in
                if lhs.score == rhs.score {
                    return lhs.trip.pricePerPerson < rhs.trip.pricePerPerson
                }
                return lhs.score > rhs.score
            }
            .map(\.trip)
    }

    private func score(for trip: TripCard, preferences: UserPreferences) -> Int {
        var score = 0

        switch preferences.budget {
        case .budget:
            score += trip.pricePerPerson <= 750 ? 3 : 0
        case .midRange:
            score += (750...1250).contains(trip.pricePerPerson) ? 3 : 1
        case .premium:
            score += trip.pricePerPerson >= 1250 ? 3 : 0
        }

        if preferences.airport == .any || trip.airport == preferences.airport.rawValue {
            score += 2
        }

        switch preferences.duration {
        case .short:
            score += trip.nights <= 5 ? 2 : 0
        case .week:
            score += (6...8).contains(trip.nights) ? 2 : 0
        case .long:
            score += trip.nights >= 9 ? 2 : 0
        }

        switch preferences.travelStyle {
        case .sun:
            score += trip.tags.contains(where: { ["Strand", "Zonzeker", "Zwembad"].contains($0) }) ? 3 : 0
        case .romantic:
            score += trip.tags.contains("Romantisch") ? 3 : 0
        case .family:
            score += trip.tags.contains("Familie") ? 3 : 0
        case .luxury:
            score += trip.tags.contains("Luxe") ? 3 : 0
        }

        if preferences.departureMonth == .flexible {
            score += 1
        } else if trip.departureLabel.localizedCaseInsensitiveContains(preferences.departureMonth.rawValue) {
            score += 2
        }

        return score
    }
}
