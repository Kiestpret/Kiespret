import SwiftUI

struct SwipeCardStack: View {
    let trips: [TripCard]
    let onReject: (TripCard) -> Void
    let onSave: (TripCard) -> Void

    var body: some View {
        ZStack {
            if trips.isEmpty {
                emptyState
            } else {
                ForEach(Array(trips.prefix(3).enumerated()), id: \.element.id) { index, trip in
                    SwipeCardView(
                        trip: trip,
                        isTopCard: index == 0,
                        onReject: { onReject(trip) },
                        onSave: { onSave(trip) }
                    )
                    .padding(.top, CGFloat(index) * 12)
                    .scaleEffect(1 - (CGFloat(index) * 0.04))
                    .zIndex(Double(3 - index))
                }
            }
        }
        .animation(.spring(response: 0.32, dampingFraction: 0.82), value: trips)
    }

    private var emptyState: some View {
        VStack(spacing: 14) {
            Image(systemName: "airplane.circle")
                .font(.system(size: 56))
                .foregroundStyle(Color("AccentColor"))
            Text("Je deck is leeg")
                .font(.title3.bold())
            Text("Reset het deck om deze pakketreizen opnieuw te bekijken.")
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(.white)
        .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
    }
}

private struct SwipeCardView: View {
    let trip: TripCard
    let isTopCard: Bool
    let onReject: () -> Void
    let onSave: () -> Void

    @State private var offset: CGSize = .zero
    @State private var showDetail = false

    var body: some View {
        let drag = DragGesture()
            .onChanged { gesture in
                guard isTopCard else { return }
                offset = gesture.translation
            }
            .onEnded { gesture in
                guard isTopCard else { return }
                handleDragEnded(translation: gesture.translation)
            }

        TripCardView(trip: trip)
            .rotationEffect(.degrees(Double(offset.width / 20)))
            .offset(offset)
            .gesture(drag)
            .onTapGesture {
                guard isTopCard else { return }
                showDetail = true
            }
            .overlay(alignment: .top) {
                swipeLabel
            }
            .sheet(isPresented: $showDetail) {
                NavigationStack {
                    TripDetailView(trip: trip)
                }
            }
            .overlay(alignment: .bottom) {
                HStack(spacing: 18) {
                    actionButton(symbol: "xmark", tint: .red, action: animateReject)
                    actionButton(symbol: "heart.fill", tint: Color("AccentColor"), action: animateSave)
                }
                .padding(.bottom, 18)
                .opacity(isTopCard ? 1 : 0)
            }
    }

    private var swipeLabel: some View {
        HStack {
            if offset.width > 24 {
                Text("BEWAREN")
                    .font(.headline.bold())
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(.green.opacity(0.9))
                    .clipShape(Capsule())
            } else if offset.width < -24 {
                Text("NIETS VOOR MIJ")
                    .font(.headline.bold())
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(.red.opacity(0.9))
                    .clipShape(Capsule())
            }
        }
        .foregroundStyle(.white)
        .padding(.top, 20)
    }

    private func actionButton(symbol: String, tint: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: symbol)
                .font(.title2.weight(.bold))
                .frame(width: 58, height: 58)
                .background(.white)
                .foregroundStyle(tint)
                .clipShape(Circle())
                .shadow(color: .black.opacity(0.12), radius: 12, y: 8)
        }
        .buttonStyle(.plain)
    }

    private func handleDragEnded(translation: CGSize) {
        if translation.width > 110 {
            animateSave()
        } else if translation.width < -110 {
            animateReject()
        } else {
            withAnimation(.spring()) {
                offset = .zero
            }
        }
    }

    private func animateReject() {
        withAnimation(.easeIn(duration: 0.18)) {
            offset = CGSize(width: -500, height: 40)
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.18) {
            onReject()
            offset = .zero
        }
    }

    private func animateSave() {
        withAnimation(.easeIn(duration: 0.18)) {
            offset = CGSize(width: 500, height: -40)
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.18) {
            onSave()
            offset = .zero
        }
    }
}
