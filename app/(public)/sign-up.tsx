import * as React from 'react'
import { Text, TextInput, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'
import { Link } from 'expo-router'
import { Colors } from '@/constants/Colors'

type SignUpFormData = {
    email: string
    password: string
}

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [isSignUpLoading, setIsSignUpLoading] = React.useState(false)
    const [isVerifyLoading, setIsVerifyLoading] = React.useState(false)
    const [verificationCode, setVerificationCode] = React.useState('')

    const { control: signUpControl, handleSubmit: handleSignUpSubmit, formState: { errors: signUpErrors } } =
        useForm<SignUpFormData>({
            defaultValues: {
                email: '',
                password: ''
            }
        })

    const onSignUpPress = async (data: SignUpFormData) => {
        if (!isLoaded) return
        setIsSignUpLoading(true)

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setPendingVerification(true)
        } catch (err) {
            console.log(JSON.stringify(err, null, 2))
        } finally {
            setIsSignUpLoading(false)
        }
    }

    const onVerifyPress = async () => {
        if (!isLoaded) return
        setIsVerifyLoading(true)

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            })

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setIsVerifyLoading(false)
        }
    }

    if (pendingVerification) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Verify your email</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={verificationCode}
                            placeholder="Enter verification code"
                            onChangeText={(text) => {
                                // Only allow numeric input
                                const numericValue = text.replace(/[^0-9]/g, '')
                                setVerificationCode(numericValue)
                            }}
                            style={styles.input}
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            maxLength={6}
                            autoFocus={true}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed,
                                isVerifyLoading && styles.buttonDisabled
                            ]}
                            onPress={onVerifyPress}
                            disabled={isVerifyLoading}
                        >
                            {isVerifyLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Verify Email</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>

                <Controller
                    control={signUpControl}
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
                                style={[styles.input, signUpErrors.email && styles.inputError]}
                                placeholderTextColor="#666"
                                keyboardType="email-address"
                            />
                            {signUpErrors.email && (
                                <Text style={styles.errorText}>{signUpErrors.email.message}</Text>
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={signUpControl}
                    rules={{
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: 'Password must contain uppercase, lowercase, number and special character'
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
                                style={[styles.input, signUpErrors.password && styles.inputError]}
                                placeholderTextColor="#666"
                            />
                            {signUpErrors.password && (
                                <Text style={styles.errorText}>{signUpErrors.password.message}</Text>
                            )}
                        </View>
                    )}
                />

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                            (isSignUpLoading) && styles.buttonDisabled
                        ]}
                        onPress={handleSignUpSubmit(onSignUpPress)}
                        disabled={isSignUpLoading}
                    >
                        {isSignUpLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Sign up</Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Link href="/sign-in" asChild>
                        <Pressable>
                            <Text style={styles.link}>Sign in</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
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