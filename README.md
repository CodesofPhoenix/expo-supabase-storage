# Supabase Storage with Expo

Learn how to use ### Supabase Storage, ### Expo, and ### Expo Image Picker to upload, view, and delete images in your mobile application.

This repository contains the example code accompanying the full tutorial.

## Full Tutorial

Want to follow the complete implementation step by step?

### Read the Full Tutorial: [Supabase Storage with Expo: Upload and Manage Images](https://www.codesofphoenix.com/articles/supabase/storage-with-expo)

The tutorial explains how to integrate Supabase Storage into your Expo app, configure your project, and secure your files.

## What You'll Learn
Select images using Expo Image Picker
Upload images to Supabase Storage
View uploaded images in your app
Delete images from a Storage bucket
Generate signed URLs for accessing private files
Configure Storage policies to control file access
## Storage Policies and Security

Supabase Storage policies determine who can access and manage files in your Storage buckets.

Depending on your application's requirements, these policies can control who is allowed to:

Upload new images
View or download stored images
Delete existing files
Access files in private buckets

Correctly configured policies help prevent unauthorized users from accessing or modifying files. The exact permissions depend on your application's needs and whether your bucket is public or private.

The required Storage policies are explained in the full tutorial, including how to configure access for the operations demonstrated in the example.

## Follow the [tutorial](https://www.codesofphoenix.com/articles/supabase/storage-with-expo) for Storage policy configuration

Security note: A Supabase publishable key is intended for client-side use, but it does not replace proper access controls. Never expose your service_role key or other secret credentials in your Expo application or public repository.

## Getting Started
Create a Supabase project.
Set up your Expo application and install the required dependencies.
Configure your Supabase project URL and publishable key.
Create and configure your Storage bucket.
Follow the full tutorial to integrate the example and configure the required Storage policies.

See the full tutorial for detailed setup and implementation instructions.

## Technologies Used
Expo  
Expo Image Picker  
Supabase Storage

## License

This project is licensed under the MIT License. See the LICENSE file for details.
