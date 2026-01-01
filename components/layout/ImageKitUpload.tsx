"use client"

import { useState, useRef } from "react";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

interface ImageKitUploadProps {
    value?: { url: string; fileId: string } | null;
    onChange?: (data: { url: string; fileId: string } | null) => void;
    folder?: string;
    label?: string;
    instructorId?: string;
}

export default function ImageKitUpload({ 
    value, 
    onChange, 
    folder = "/instructors", 
    label = "Upload Image",
    instructorId 
}: ImageKitUploadProps) {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value?.url || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const authenticator = async () => {
        try {
            console.log("Fetching auth params...");
            const response = await fetch("/api/upload-auth");
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Auth API error:", errorText);
                throw new Error(`Authentication failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Verify all required fields
            if (!data.token || !data.signature || !data.expire) {
                console.error("Invalid auth response:", data);
                throw new Error("Invalid authentication response");
            }
            
            console.log("Auth params received successfully:", {
                hasToken: !!data.token,
                hasSignature: !!data.signature,
                expire: data.expire
            });
            
            return data;
        } catch (error) {
            console.error("Authentication error:", error);
            throw error;
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            setError("Please select a file to upload");
            return;
        }

        if (!instructorId) {
            setError("Please create instructor first");
            return;
        }

        const file = fileInput.files[0];
        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            // Get authentication parameters
            const authParams = await authenticator();
            
            // Get public key from environment
            const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
            
            if (!publicKey) {
                throw new Error("ImageKit public key not found");
            }

            // Create FormData
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", file.name);
            formData.append("publicKey", publicKey);
            formData.append("signature", authParams.signature);
            formData.append("expire", authParams.expire.toString());
            formData.append("token", authParams.token);
            formData.append("folder", folder);
            formData.append("customCoordinates", instructorId);
            formData.append("webhookUrl", `${window.location.origin}/api/imagekit-webhook`);

            console.log("Uploading with params:", {
                fileName: file.name,
                folder,
                instructorId,
                publicKey: publicKey.substring(0, 20) + "..."
            });

            // Create abort controller
            abortControllerRef.current = new AbortController();

            // Upload with XMLHttpRequest
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setProgress(percentComplete);
                }
            });

            xhr.addEventListener("load", () => {
                console.log("Upload response status:", xhr.status);
                console.log("Upload response:", xhr.responseText);
                
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.log("Upload successful:", response);
                        
                        if (onChange) {
                            onChange({ 
                                url: response.url, 
                                fileId: response.fileId 
                            });
                        }
                        
                        setPreview(response.url);
                        setUploading(false);
                        setError(null);
                    } catch (parseError) {
                        console.error("Response parse error:", parseError);
                        setError("Failed to parse upload response");
                        setUploading(false);
                    }
                } else {
                    console.error("Upload failed:", xhr.responseText);
                    let errorMessage = "Upload failed";
                    
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        errorMessage = errorResponse.message || errorMessage;
                    } catch (e) {
                        errorMessage = xhr.responseText || errorMessage;
                    }
                    
                    setError(errorMessage);
                    setUploading(false);
                }
            });

            xhr.addEventListener("error", () => {
                console.error("Upload network error");
                setError("Upload failed due to network error");
                setUploading(false);
            });

            xhr.addEventListener("abort", () => {
                console.log("Upload cancelled");
                setUploading(false);
                setProgress(0);
            });

            abortControllerRef.current.signal.addEventListener("abort", () => {
                xhr.abort();
            });

            xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
            xhr.send(formData);

        } catch (error) {
            console.error("Upload error:", error);
            setError(error instanceof Error ? error.message : "Upload failed");
            setUploading(false);
        }
    };

    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        if (onChange) {
            onChange(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <div className="space-y-4">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        disabled={uploading || !instructorId}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    
                    {!instructorId && (
                        <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                            Please save the instructor first before uploading image
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </p>
                    )}

                    {preview && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            {!uploading && (
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    )}

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Uploading...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading || !instructorId || !fileInputRef.current?.files?.[0]}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                        
                        {uploading && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </FormControl>
        </FormItem>
    );
}
