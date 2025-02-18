import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const Feed = () => {
    const users = useQuery(api.users.getAllUsers);
    console.log(users, 'users')
    return (
        <View>
            <Text>Feed</Text>
        </View>
    )
}

export default Feed

const styles = StyleSheet.create({})