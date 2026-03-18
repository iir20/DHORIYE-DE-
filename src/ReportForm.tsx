import React, { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const LocationPickerMap = React.lazy(() => import('@/components/map/LocationPickerMap'));

interface Location {
  lat: number;
  lng: number;
}

export default function ReportForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [corruptionType, setCorruptionType] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!location) {
        alert('Please select a location on the map.');
        return;
      }

      try {
        let imageUrl = '';
        if (photo) {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('report_photos')
            .upload(filePath, photo);

          if (uploadError) {
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('report_photos')
            .getPublicUrl(filePath);
          
          imageUrl = publicUrl;
        }

        const { error: insertError } = await supabase
          .from('reports')
          .insert([
            {
              title,
              description,
              corruption_type: corruptionType,
              latitude: location.lat,
              longitude: location.lng,
              image_url: imageUrl,
            },
          ]);

        if (insertError) {
          throw insertError;
        }

        alert('রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে।'); // Report submitted successfully.
        window.location.href = '/';
      } catch (error: any) {
        console.error('Error submitting report:', error);
        alert(`রিপোর্ট জমা দিতে একটি ত্রুটি হয়েছে: ${error.message || 'Unknown error'}`);
      }
    };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>নতুন দুর্নীতির রিপোর্ট জমা দিন</CardTitle>
          <CardDescription>আপনার পরিচয় সম্পূর্ণ গোপন রাখা হবে। নির্ভয়ে তথ্য দিন।</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">শিরোনাম</Label>
            <Input id="title" placeholder="ঘটনার একটি সংক্ষিপ্ত শিরোনাম দিন" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">বিস্তারিত বর্ণনা</Label>
            <Textarea id="description" placeholder="ঘটনাটি বিস্তারিত বর্ণনা করুন" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="corruption-type">দুর্নীতির ধরন</Label>
            <Select onValueChange={setCorruptionType} required>
              <SelectTrigger id="corruption-type">
                <SelectValue placeholder="দুর্নীতির ধরন নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bribery">ঘুষ</SelectItem>
                <SelectItem value="extortion">চাদাবাজি</SelectItem>
                <SelectItem value="fraud">প্রতারণা</SelectItem>
                <SelectItem value="abuse_of_power">ক্ষমতার অপব্যবহার</SelectItem>
                <SelectItem value="other">অন্যান্য</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>ঘটনার স্থান</Label>
            <p className='text-sm text-muted-foreground'>ম্যাপে ক্লিক করে ঘটনার সঠিক স্থান নির্বাচন করুন। আপনার বর্তমান অবস্থান দেখানোর চেষ্টা করা হবে।</p>
            <Suspense fallback={<div className="h-64 w-full rounded-md bg-muted animate-pulse"></div>}>
              <LocationPickerMap onLocationSelect={setLocation} />
            </Suspense>
            {location && <p className='text-xs text-muted-foreground'>Selected: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">ছবি সংযুক্ত করুন (ঐচ্ছিক)</Label>
            <Input id="photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">রিপোর্ট জমা দিন</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
