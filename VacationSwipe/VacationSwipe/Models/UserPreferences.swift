import Foundation

struct UserPreferences {
    var budget: Budget = .midRange
    var departureMonth: DepartureMonth = .june
    var airport: Airport = .schiphol
    var duration: TripDuration = .week
    var travelStyle: TravelStyle = .sun

    enum Budget: String, CaseIterable, Identifiable {
        case budget = "Tot 750"
        case midRange = "750 - 1250"
        case premium = "1250+"

        var id: String { rawValue }
    }

    enum DepartureMonth: String, CaseIterable, Identifiable {
        case may = "Mei"
        case june = "Juni"
        case september = "September"
        case flexible = "Flexibel"

        var id: String { rawValue }
    }

    enum Airport: String, CaseIterable, Identifiable {
        case schiphol = "Schiphol"
        case eindhoven = "Eindhoven"
        case dusseldorf = "Dusseldorf"
        case any = "Maakt niet uit"

        var id: String { rawValue }
    }

    enum TripDuration: String, CaseIterable, Identifiable {
        case short = "3 - 5 nachten"
        case week = "6 - 8 nachten"
        case long = "9+ nachten"

        var id: String { rawValue }
    }

    enum TravelStyle: String, CaseIterable, Identifiable {
        case sun = "Zon"
        case romantic = "Romantisch"
        case family = "Familie"
        case luxury = "Luxe"

        var id: String { rawValue }
    }
}
