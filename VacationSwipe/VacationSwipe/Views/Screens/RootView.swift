import SwiftUI

struct RootView: View {
    @ObservedObject var appState: AppState

    var body: some View {
        Group {
            if appState.hasCompletedOnboarding {
                MainTabView(appState: appState)
            } else {
                OnboardingView(appState: appState)
            }
        }
    }
}

private struct MainTabView: View {
    @ObservedObject var appState: AppState

    var body: some View {
        TabView {
            NavigationStack {
                DiscoverView(appState: appState)
            }
            .tabItem {
                Label("Ontdekken", systemImage: "sparkles.rectangle.stack")
            }

            NavigationStack {
                FavoritesView(appState: appState)
            }
            .tabItem {
                Label("Shortlist", systemImage: "heart.fill")
            }
        }
        .tint(Color("AccentColor"))
    }
}
