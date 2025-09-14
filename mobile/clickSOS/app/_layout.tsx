import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "./styles/global.css"

export default function RootLayout() {
    return (
        <React.Fragment>
            <StatusBar style="auto"/>
            <Stack>
                <Stack.Screen name="(protected)" options={{
                    headerShown: false,
                    }}
                />
            </Stack>
        </React.Fragment>
    );
}