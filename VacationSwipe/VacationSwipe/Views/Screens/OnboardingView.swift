import SwiftUI

struct OnboardingView: View {
    @ObservedObject var appState: AppState

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    header
                    selectionSection(
                        title: "Budget per persoon",
                        selection: preferenceBinding(\.budget)
                    )
                    selectionSection(
                        title: "Wanneer wil je weg?",
                        selection: preferenceBinding(\.departureMonth)
                    )
                    selectionSection(
                        title: "Vertrek vanaf",
                        selection: preferenceBinding(\.airport)
                    )
                    selectionSection(
                        title: "Hoe lang wil je weg?",
                        selection: preferenceBinding(\.duration)
                    )
                    selectionSection(
                        title: "Wat voor vakantie zoek je?",
                        selection: preferenceBinding(\.travelStyle)
                    )
                    startButton
                }
                .padding(20)
            }
            .background(backgroundGradient.ignoresSafeArea())
            .navigationBarHidden(true)
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Swipe je volgende vakantie")
                .font(.system(size: 34, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
            Text("Geef je voorkeuren op en krijg meteen pakketreizen te zien die passen bij jouw budget, luchthaven en vibe.")
                .font(.headline)
                .foregroundStyle(.white.opacity(0.88))
        }
        .padding(.top, 20)
    }

    private func selectionSection<Selection: CaseIterable & Identifiable & RawRepresentable>(
        title: String,
        selection: Binding<Selection>
    ) -> some View where Selection.RawValue == String {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .foregroundStyle(.white)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                ForEach(Array(Selection.allCases), id: \.id) { option in
                    Button {
                        selection.wrappedValue = option
                    } label: {
                        Text(option.rawValue)
                            .font(.subheadline.weight(.semibold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(selection.wrappedValue.id == option.id ? Color.white : Color.white.opacity(0.14))
                            .foregroundStyle(selection.wrappedValue.id == option.id ? Color.black : Color.white)
                            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private var startButton: some View {
        Button(action: appState.completeOnboarding) {
            HStack {
                Text("Bekijk mijn matches")
                Spacer()
                Image(systemName: "arrow.right")
            }
            .font(.headline.weight(.bold))
            .padding()
            .frame(maxWidth: .infinity)
            .background(Color.white)
            .foregroundStyle(Color.black)
            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        }
        .padding(.top, 8)
    }

    private var backgroundGradient: some View {
        LinearGradient(
            colors: [Color(red: 0.98, green: 0.46, blue: 0.27), Color(red: 0.1, green: 0.25, blue: 0.47)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    private func preferenceBinding<Value>(_ keyPath: WritableKeyPath<UserPreferences, Value>) -> Binding<Value> {
        Binding(
            get: { appState.preferences[keyPath: keyPath] },
            set: { appState.preferences[keyPath: keyPath] = $0 }
        )
    }
}
