'use client';
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import toast from 'react-hot-toast';

export default function PatientMediaUpload() {
  const { axios, user } = useAppContext();
  const [images, setImages] = useState([{ file: null, preview: '' }]);
  const [videos, setVideos] = useState([{ file: null, preview: '' }]);
  const [loading, setLoading] = useState(false);

  // Image selection
  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...images];
    updated[index] = { file, preview: URL.createObjectURL(file) };
    setImages(updated);
    if (index === images.length - 1) {
      setImages([...updated, { file: null, preview: '' }]);
    }
  };

  // Video selection
  const handleVideoChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...videos];
    updated[index] = { file, preview: URL.createObjectURL(file) };
    setVideos(updated);
    if (index === videos.length - 1) {
      setVideos([...updated, { file: null, preview: '' }]);
    }
  };

  // Submit
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Optional: Send other user fields if you want
      formData.append('name', user?.name || '');
      formData.append('phone', user?.phone || '');
      formData.append('gender', user?.gender || '');
      formData.append('dob', user?.dob || '');
      formData.append('address', JSON.stringify(user?.address || { line1: '', line2: '' }));

      images.forEach((img) => {
        if (img.file) formData.append('images', img.file);
      });
      videos.forEach((vid) => {
        if (vid.file) formData.append('videos', vid.file);
      });

      // check if any file uploaded
      if (images.every((img) => !img.file) && videos.every((vid) => !vid.file)) {
        toast('⚠️ Please select at least one image or video');
        return;
      }

      const res = await axios.put('/api/auth/user/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Media shared successfully!');
        // clear the form after success
        setImages([{ file: null, preview: '' }]);
        setVideos([{ file: null, preview: '' }]);
        
      } else {
        alert(res.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Share Your Media with Doctor</h2>

      {/* Image Upload */}
      <h3 className="text-lg font-medium mb-2">Images (Optional)</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="border-2 border-dashed rounded-lg p-2 flex flex-col items-center justify-center"
          >
            {img.preview ? (
              <Image src={img.preview} alt="Preview" width={100} height={100} className="rounded-md" />
            ) : (
              <label className="flex flex-col items-center cursor-pointer text-gray-500">
                <Image src={assets.AddIcon} width={20} height={20} alt="" />
                <span className="text-xs">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(index, e)}
                />
              </label>
            )}
          </div>
        ))}
      </div>

      {/* Video Upload */}
      <h3 className="text-lg font-medium mb-2">Videos (Optional)</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {videos.map((vid, index) => (
          <div
            key={index}
            className="border-2 border-dashed rounded-lg p-2 flex flex-col items-center justify-center"
          >
            {vid.preview ? (
              <video src={vid.preview} controls className="rounded-md w-full h-28 object-cover" />
            ) : (
              <label className="flex flex-col items-center cursor-pointer text-gray-500">
                <Image src={assets.AddIcon} width={20} height={20} alt="" />
                <span className="text-xs">Add Video</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleVideoChange(index, e)}
                />
              </label>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary active:scale-95 text-white py-2 rounded-lg transition cursor-pointer"
      >
        {loading ? 'Uploading...' : 'Share Media'}
      </button>
    </div>
  );
}
