import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean; resetKey: number }> {
  state = { hasError: false, resetKey: 0 };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) console.error("App route error", error);
  }

  private recover = () => {
    this.setState((current) => ({ hasError: false, resetKey: current.resetKey + 1 }));
  };

  render() {
    if (!this.state.hasError) return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>;
    return (
      <View style={styles.screen} accessibilityRole="alert">
        <Text style={styles.eyebrow}>SAFE RECOVERY</Text>
        <Text style={styles.title}>This moment needs a reset.</Text>
        <Text style={styles.body}>The screen could not load safely. Your saved journal stays on this device.</Text>
        <Pressable onPress={this.recover} accessibilityRole="button" accessibilityLabel="Try again" accessibilityHint="Reloads the screen while keeping your saved local journal on this device." style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: 28, backgroundColor: "#F7F4ED", gap: 12 },
  eyebrow: { color: "#718078", fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#24312B", fontSize: 30, lineHeight: 36, fontWeight: "800" },
  body: { color: "#718078", fontSize: 15, lineHeight: 22, maxWidth: 320 },
  button: { marginTop: 8, minHeight: 52, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#48634B" },
  buttonText: { color: "#FFFDF8", fontSize: 15, fontWeight: "800" },
});
