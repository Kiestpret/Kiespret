import SwiftUI

struct TripCardView: View {
    let trip: TripCard

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            RoundedRectangle(cornerRadius: 30, style: .continuous)
                .fill(
                    LinearGradient(
                        colors: [Color(red: 0.99, green: 0.75, blue: 0.30), Color(red: 0.16, green: 0.54, blue: 0.83)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Image(systemName: trip.heroSystemImage)
                .font(.system(size: 110))
                .foregroundStyle(.white.opacity(0.18))
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)

            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    infoPill(trip.provider)
                    Spacer()
                    infoPill("\(trip.pricePerPerson) p.p.")
                }

                Spacer()

                VStack(alignment: .leading, spacing: 6) {
                    Text(trip.title)
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                    Text(trip.destination)
                        .font(.headline)
                }

                Text(trip.matchReason)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.white.opacity(0.9))

                HStack(spacing: 8) {
                    detailChip("\(trip.nights) nachten")
                    detailChip(trip.airport)
                    detailChip(trip.boardType)
                }

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(trip.tags, id: \.self) { tag in
                            detailChip(tag)
                        }
                    }
                }
            }
            .padding(22)
            .foregroundStyle(.white)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .shadow(color: .black.opacity(0.16), radius: 18, y: 12)
    }

    private func infoPill(_ text: String) -> some View {
        Text(text)
            .font(.subheadline.weight(.bold))
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(.white.opacity(0.18))
            .clipShape(Capsule())
    }

    private func detailChip(_ text: String) -> some View {
        Text(text)
            .font(.footnote.weight(.semibold))
            .padding(.horizontal, 10)
            .padding(.vertical, 7)
            .background(.black.opacity(0.14))
            .clipShape(Capsule())
    }
}
