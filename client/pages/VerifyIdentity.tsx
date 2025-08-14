import { FaceVerification } from "@/components/FaceVerification";

export default function VerifyIdentity() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
        <p className="text-muted-foreground mb-8">
          Please complete the face verification process to secure your account.
        </p>
        <FaceVerification />
      </div>
    </div>
  );
}
