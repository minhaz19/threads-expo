import { isClerkRuntimeError, useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/Colors'

type FormData = {
    email: string
    password: string
}

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
    const [isSignInLoading, setIsSignInLoading] = React.useState(false)

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    // Handle the submission of the sign-in form
    const onSignInPress = async (data: FormData) => {
        if (!isLoaded) return
        setIsSignInLoading(true)

        try {
            const signInAttempt = await signIn.create({
                identifier: data.email,
                password: data.password,
            })

            if (signInAttempt.status === 'complete') {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Signed in successfully'
                })
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong. Please try again.'
                })
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            let errorMessage = 'Something went wrong. Please try again.'
            
            if (isClerkRuntimeError(err)) {
                switch (err.code) {
                    case 'network_error':
                        errorMessage = 'Network error occurred. Please check your connection.'
                        break
                    case 'form_identifier_not_found':
                        errorMessage = 'Email not found.'
                        break
                    case 'form_password_incorrect':
                        errorMessage = 'Incorrect password.'
                        break
                    default:
                        errorMessage = err.message
                }
            }

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage
            })
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setIsSignInLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                
                <Controller
                    control={control}
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                        }
                    }}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <TextInput
                                autoCapitalize="none"
                                value={value}
                                placeholder="Enter email"
                                onChangeText={onChange}
                                style={[styles.input, errors.email && styles.inputError]}
                                placeholderTextColor="#666"
                                keyboardType="email-address"
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email.message}</Text>
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    rules={{
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                        }
                    }}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={value}
                                placeholder="Enter password"
                                secureTextEntry={true}
                                onChangeText={onChange}
                                style={[styles.input, errors.password && styles.inputError]}
                                placeholderTextColor="#666"
                            />
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password.message}</Text>
                            )}
                        </View>
                    )}
                />
                
                <View style={styles.buttonContainer}>
                    <Pressable 
                        style={({pressed}) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                            isSignInLoading && styles.buttonDisabled
                        ]}
                        onPress={handleSubmit(onSignInPress)}
                        disabled={isSignInLoading}
                    >
                        {isSignInLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Sign in</Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href="/sign-up" asChild>
                        <Pressable>
                            <Text style={styles.link}>Sign up</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
            <Toast />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    formContainer: {
        padding: 24,
        flex: 1,    
        justifyContent: 'center',
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 16,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
        color: '#000',
    },
    inputError: {
        borderColor: '#ff0000',
    },
    errorText: {
        color: '#ff0000',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        overflow: 'hidden',
    },
    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 14,
    },
    link: {
        color: '#000',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
})