"use client";

import * as React from "react";
import { Crown, Shield, Eye, CheckCircle } from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/hooks/use-language";
import { PageLoader } from "@/components/common/Loader";
import { getCookie } from "@/utils/getToken";
import { ProfileCard } from "./ProfileCard";
import { NavigationButtons } from "./navigationButton";
import { ProfileData } from "@/types/profile";
import { useAuth } from "@/app/(auth)/context/auth-context";
import { getOwnBiodata } from "@/app/actions/getOwnBiodata";
import { useRouter, useSearchParams } from "next/navigation";

export default function Profile() {
  const [profile, setProfile] = React.useState<ProfileData | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [showOAuthSuccess, setShowOAuthSuccess] = React.useState(false);
  const [oauthProvider, setOauthProvider] = React.useState("");
  
  const token = getCookie("token") || "";
  const { user } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for OAuth login success
  React.useEffect(() => {
    const oauth = searchParams.get("oauth");
    const login = searchParams.get("login");

    if (login === "success" && oauth) {
      setShowOAuthSuccess(true);
      setOauthProvider(oauth);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowOAuthSuccess(false), 5000);

      // Clean URL without triggering re-render
      window.history.replaceState({}, "", "/profile");
    }
  }, [searchParams]);

  React.useEffect(() => {
    getOwnBiodata();
  }, []);

  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/ownProfile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        setProfile(response?.data?.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return <PageLoader />;
  }

  const getProviderName = (provider: string) => {
    const providers: { [key: string]: string } = {
      google: "Google",
      github: "GitHub",
      yahoo: "Yahoo",
    };
    return providers[provider] || provider;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 mt-7">
      {/* OAuth Success Banner */}
      {showOAuthSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px]">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">
                {language === "bn"
                  ? "সফলভাবে লগইন হয়েছে!"
                  : "Successfully Logged In!"}
              </p>
              <p className="text-sm text-emerald-100">
                {language === "bn"
                  ? `${getProviderName(oauthProvider)} দিয়ে লগইন সম্পন্ন হয়েছে`
                  : `Logged in with ${getProviderName(oauthProvider)}`}
              </p>
            </div>
            <button
              onClick={() => setShowOAuthSuccess(false)}
              className="ml-4 text-white hover:text-emerald-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-800 dark:to-emerald-950"></div>
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white/80 text-sm">
                    {language === "bn" ? "সাবস্ক্রিপশন" : "Subscription"}
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {user?.subscriptionType}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white/80 text-sm">
                    {language === "bn" ? "প্রোফাইল ভিউ" : "Profile Views"}
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {profile?.subscriptionId?.profileViewLimit || 0}{" "}
                    {language === "bn" ? "বাকি" : "Left"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white/80 text-sm">
                    {language === "bn" ? "স্ট্যাটাস" : "Status"}
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {language === "bn" ? "সক্রিয়" : "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <ProfileCard profile={profile} />
            </div>
          </div>

          {/* Main Actions */}
          <div className="xl:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-8 px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === "bn" ? "আপনার প্রোফাইল" : "Your Profile"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "bn"
                    ? "নিচের অপশনগুলি ব্যবহার করে আপনার অনুরোধ এবং আগ্রহ পরিচালনা করুন"
                    : "Manage your requests and interests using the options below"}
                </p>
              </div>

              <NavigationButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}