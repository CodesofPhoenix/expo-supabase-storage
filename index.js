
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {
      await loadImages(user.id);
    }
  }

  async function signUp() {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Sign up failed", error.message);
      return;
    }

    setUser(data.user);

    Alert.alert("Success", "Your account has been created.");
  }

  async function signIn() {
    setLoading(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      Alert.alert("Sign in failed", error.message);
      return;
    }

    setUser(data.user);

    await loadImages(data.user.id);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign out failed", error.message);
      return;
    }

    setUser(null);
    setImages([]);
  }

  async function pickAndUploadImage() {
    if (!user) {
      Alert.alert("Error", "You must be signed in.");
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const image = result.assets[0];

    try {
      const response = await fetch(image.uri);
      const arrayBuffer = await response.arrayBuffer();

      const fileExtension =
        image.fileName?.split(".").pop() || "jpg";

      const fileName = `${Date.now()}.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;

      const { error } = await supabase.storage
        .from("files")
        .upload(filePath, arrayBuffer, {
          contentType: image.mimeType || "image/jpeg",
        });

      if (error) {
        Alert.alert("Upload failed", error.message);
        return;
      }

      Alert.alert("Success", "Image uploaded!");

      await loadImages(user.id);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Something went wrong while uploading."
      );
    }
  }

  async function loadImages(userId) {
    const { data, error } = await supabase.storage
      .from("files")
      .list(userId);

    if (error) {
      console.error("LIST ERROR:", error);
      return;
    }

    const files = data.filter(
      (file) => file.name !== ".emptyFolderPlaceholder"
    );

    if (files.length === 0) {
      setImages([]);
      return;
    }

    const imagePaths = files.map(
      (file) => `${userId}/${file.name}`
    );

    const {
      data: signedUrls,
      error: signedUrlError,
    } = await supabase.storage
      .from("files")
      .createSignedUrls(imagePaths, 60 * 60);

    if (signedUrlError) {
      console.error("SIGNED URL ERROR:", signedUrlError);
      return;
    }

    const imageData = signedUrls.map((item, index) => ({
      name: files[index].name,
      path: imagePaths[index],
      url: item.signedUrl,
    }));

    setImages(imageData);
  }

  async function deleteImage(path) {
    const { error } = await supabase.storage
      .from("files")
      .remove([path]);

    if (error) {
      Alert.alert("Delete failed", error.message);
      return;
    }

    setImages((currentImages) =>
      currentImages.filter((image) => image.path !== path)
    );

    Alert.alert("Success", "Image deleted.");
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Supabase Storage</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title={loading ? "Signing up..." : "Sign Up"}
          onPress={signUp}
          disabled={loading}
        />

        <View style={styles.spacing} />

        <Button
          title={loading ? "Signing in..." : "Sign In"}
          onPress={signIn}
          disabled={loading}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Images</Text>

      <Text style={styles.email}>{user.email}</Text>

      <Button
        title="Choose & Upload Image"
        onPress={pickAndUploadImage}
      />

      <View style={styles.images}>
        {images.map((image) => (
          <View key={image.path} style={styles.imageContainer}>
            <Image
              source={{ uri: image.url }}
              style={styles.image}
            />

            <Button
              title="Delete"
              onPress={() => deleteImage(image.path)}
            />
          </View>
        ))}
      </View>

      <View style={styles.spacing} />

      <Button title="Sign Out" onPress={signOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },

  email: {
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  images: {
    marginTop: 20,
  },

  imageContainer: {
    marginBottom: 20,
  },

  image: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 8,
  },

  spacing: {
    height: 12,
  },
});

  
