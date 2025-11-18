"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser } from "@/actions/user";
import { useUser } from "@/contexts/user-context";

const ProfileForm = ({ industries, initialData }) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const { updateUserData } = useUser();

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: initialData?.industry || "",
      subIndustry: initialData?.subIndustry || "",
      experience: initialData?.experience ? String(initialData.experience) : "",
      skills: initialData?.skills || "",
      bio: initialData?.bio || "",
    },
  });

  useEffect(() => {
    register("industry");
    register("subIndustry");
  }, [register]);

  // Track initial industry to prevent resetting subIndustry on mount
  const [initialIndustry, setInitialIndustry] = useState(null);

  // Set initial values when component mounts
  useEffect(() => {
    if (initialData) {
      reset({
        industry: initialData.industry || "",
        subIndustry: initialData.subIndustry || "",
        experience: initialData.experience ? String(initialData.experience) : "",
        skills: initialData.skills || "",
        bio: initialData.bio || "",
      });

      // Set selected industry for sub-industry dropdown
      if (initialData.industry) {
        const industryData = industries.find((ind) => ind.id === initialData.industry);
        setSelectedIndustry(industryData);
        setInitialIndustry(initialData.industry); // Store initial industry
      }
    }
  }, [initialData, industries, reset]);

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
      // Don't show toast here - let useEffect handle it to avoid duplicates

    } catch (error) {
      toast.error("Profile update failed!");
      console.error("Profile update error:", error);
    }
  };

  // Use ref to track if we've already shown toast for current result
  const hasShownToast = useRef(false);
  const lastResultRef = useRef(null);

  useEffect(() => {
    // Reset flag when a new update starts (updateLoading becomes true or updateResult changes)
    if (updateLoading || (lastResultRef.current !== updateResult && !updateResult?.success)) {
      hasShownToast.current = false;
      lastResultRef.current = updateResult;
    }

    // Only process if we have a success result, not loading, and haven't shown toast yet
    if (updateResult?.success && !updateLoading && !hasShownToast.current) {
      hasShownToast.current = true;
      lastResultRef.current = updateResult;
      
      // Update the global user context with new data
      updateUserData();
      toast.success("Profile updated successfully!");
      router.refresh();
    }
  }, [updateResult, updateLoading, router, updateUserData]);

  const watchIndustry = watch("industry");

  // Update selected industry when industry changes (but not on initial load)
  useEffect(() => {
    if (watchIndustry && initialIndustry !== null) {
      const industryData = industries.find((ind) => ind.id === watchIndustry);
      setSelectedIndustry(industryData);
      // Only reset sub-industry if the industry actually changed from initial
      if (watchIndustry !== initialIndustry) {
        setValue("subIndustry", "");
      }
    }
  }, [watchIndustry, industries, setValue, initialIndustry]);

  return (
    <div className="flex items-center justify-center bg-background min-h-screen py-10">
      <Card className="w-full mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Update Your Profile
          </CardTitle>
          <CardDescription>
            Keep your profile information up to date for better career insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={watchIndustry}
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  value={watch("subIndustry")}
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry?.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                className="h-32"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={updateLoading}>
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
