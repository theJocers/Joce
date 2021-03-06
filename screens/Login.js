import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button } from "react-native-ui-kitten";
import * as Google from "expo-google-app-auth";
import Constants from "expo-constants";
import { useMutation, useQuery } from "urql";
import { mutations, queries } from "./utils";
const { ANDROID_CLIENT_ID, IOS_CLIENT_ID } = Constants.manifest.extra;
import { useNavigation } from "@react-navigation/native";

export default function Login({ setGoogleUser, setMainUser }) {
  const navigation = useNavigation();
  let [loginStatus, setStatus] = useState("");

  const [loginUserResult, loginUser] = useMutation(queries.LOGIN);
  /*
  functions allows users to sign in/sign up with google
  @return: User, accessToken, statusType
  */
  const signInWithGoogleAsync = async () => {
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        scopes: ["profile", "email"],
      });
      if (type === "success") {
        setGoogleUser(user);
        let loginResult = await loginUser({ id_google: user.id })
        
          if (loginResult.data.login.user !== null) {
              setMainUser(loginResult.data.login.user);
              navigation.navigate("Dashboard");
          }
          else {
             navigation.navigate("Register");
          }
          // .catch((e) => console.error(e));
 
        return { accessToken: accessToken, user: user };
      }
    } catch (e) {
      return { error: true };
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/text-logo.png")} />
      <Button
        appearance="ghost"
        status="success"
        style={{ size: 100 }}
        title="Login with Google"
        onPress={() => {
          return loginUser(signInWithGoogleAsync());
        }}
      >
        {"Login With Google"}
      </Button>
      <Text>{loginStatus}</Text>
      <Image style={styles.rocket} source={require("../assets/picsart.png")} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8e44ad",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    bottom: 100,
    resizeMode: "contain",
  },
  rocket: {
    top: 650,
    position: "absolute",
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  button: {
    color: "#fff",
    textDecorationColor: "#8e44ad",
  },
});
