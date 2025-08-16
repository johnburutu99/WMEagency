import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProfilePictureUploader } from "@/components/ProfilePictureUploader";


export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your account preferences, privacy settings, and notifications.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile picture using your device's camera.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilePictureUploader />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>This information will be displayed on your profile.</CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-muted-foreground">Profile information management coming soon.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>Complete identity verification to secure your account.</CardDescription>
            </CardHeader>
            <CardContent>
               <Link to="/verify-identity">
                <Button variant="outline">Go to Verification Page</Button>
               </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
