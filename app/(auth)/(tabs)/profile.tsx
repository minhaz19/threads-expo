import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo';

const ProfileScreen = () => {
    const { signOut } = useAuth();
    const logout = () => {
        signOut();
    }
    return (
        <View>
            <Button onPress={logout} title="Logout" />
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})