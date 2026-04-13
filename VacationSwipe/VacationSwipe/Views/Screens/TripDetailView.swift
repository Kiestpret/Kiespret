import SwiftUI

struct TripDetailView: View {
    let trip: TripCard
    @Environment(\.openURL) private var openURL

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                hero
                summary
                highlights
                bookingSection
            }
            .padding(20)
        }
        .navigationTitle(trip.destination)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var hero: some View {
        ZStack(alignment: .bottomLeading) {
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .fill(
                    LinearGradient(
                        colors: [Color.orange, Color.blue],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(height: 260)

            Image(systemName: trip.heroSystemImage)
                .font(.system(size: 82))
                .foregroundStyle(.white.opacity(0.9))
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)

            VStack(alignment: .leading, spacing: 8) {
                Text(trip.title)
                    .font(.title.bold())
                Text(trip.hotelName)
                    .font(.headline)
            }
            .foregroundStyle(.white)
            .padding(20)
        }
    }

    private var summary: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Over deze reis")
                .font(.title3.bold())

            DetailRow(label: "Bestemming", value: trip.destination)
            DetailRow(label: "Prijs vanaf", value: "\(trip.pricePerPerson) per persoon")
            DetailRow(label: "Verblijf", value: "\(trip.nights) nachten · \(trip.boardType)")
            DetailRow(label: "Vertrek", value: "\(trip.departureLabel) vanaf \(trip.airport)")
            DetailRow(label: "Aanbieder", value: trip.provider)

            Text(trip.matchReason)
                .font(.subheadline.weight(.semibold))
                .padding(.top, 6)
        }
    }

    private var highlights: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Waarom deze trip werkt")
                .font(.title3.bold())

            ForEach(trip.highlights, id: \.self) { item in
                Label(item, systemImage: "checkmark.circle.fill")
                    .foregroundStyle(Color("AccentColor"))
            }
        }
    }

    private var bookingSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Boeken via partner")
                .font(.title3.bold())
            Text("De definitieve prijs, beschikbaarheid en voorwaarden zie je op de website van \(trip.provider).")
                .foregroundStyle(.secondary)

            Button {
                openURL(trip.bookingURL)
            } label: {
                HStack {
                    Text("Bekijk bij \(trip.provider)")
                    Spacer()
                    Image(systemName: "arrow.up.right")
                }
                .font(.headline.weight(.bold))
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color("AccentColor"))
                .foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            }
        }
    }
}

private struct DetailRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack(alignment: .top) {
            Text(label)
                .foregroundStyle(.secondary)
                .frame(width: 88, alignment: .leading)
            Text(value)
                .fontWeight(.semibold)
        }
    }
}
