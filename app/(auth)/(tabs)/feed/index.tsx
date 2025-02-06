import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'

const Feed = () => {
    const { signOut } = useAuth()
    return (
        <View>
            <Text>Feed</Text>
            <TouchableOpacity onPress={() => signOut()}><Text>Logout</Text></TouchableOpacity>
        </View>
    )
}

export default Feed

const styles = StyleSheet.create({})