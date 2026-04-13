import SwiftUI

struct DiscoverView: View {
    @ObservedObject var appState: AppState

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                deckHeader
                SwipeCardStack(
                    trips: appState.remainingTrips,
                    onReject: appState.reject,
                    onSave: appState.save
                )
                .frame(height: 540)

                Text("Definitieve prijs en beschikbaarheid worden bepaald op de website van de aanbieder.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
            .padding(20)
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("Ontdekken")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Reset", action: appState.resetDeck)
                    .disabled(appState.remainingTrips.count == appState.availableTrips.count)
            }
        }
    }

    private var deckHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Matches voor jou")
                .font(.largeTitle.bold())
            Text("\(appState.remainingTrips.count) pakketreizen passen nu bij je voorkeuren.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
}
