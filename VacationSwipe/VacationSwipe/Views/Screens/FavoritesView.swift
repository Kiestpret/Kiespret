import SwiftUI

struct FavoritesView: View {
    @ObservedObject var appState: AppState

    var body: some View {
        Group {
            if appState.favoriteTrips.isEmpty {
                ContentUnavailableView(
                    "Nog geen shortlist",
                    systemImage: "heart.slash",
                    description: Text("Swipe rechts op pakketreizen die je wilt bewaren.")
                )
            } else {
                List(appState.favoriteTrips) { trip in
                    NavigationLink {
                        TripDetailView(trip: trip)
                    } label: {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(trip.title)
                                .font(.headline)
                            Text("\(trip.destination) · \(trip.pricePerPerson) p.p.")
                                .foregroundStyle(.secondary)
                            Text("\(trip.nights) nachten · \(trip.boardType) · \(trip.provider)")
                                .font(.footnote)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .listStyle(.insetGrouped)
            }
        }
        .navigationTitle("Shortlist")
    }
}
