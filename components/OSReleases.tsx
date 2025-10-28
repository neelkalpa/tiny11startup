"use client";

import { useState, useEffect } from "react";
import { Play, Calendar, Search } from "lucide-react";
import Image from "next/image";
import { OSRelease } from "@/lib/supabase";
import Link from "next/link";

export function OSReleases() {
  const [releases, setReleases] = useState<OSRelease[]>([]);
  const [filteredReleases, setFilteredReleases] = useState<OSRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('/api/os-releases');
        const data = await response.json();

        if (!response.ok) {
          console.error('Error fetching releases:', data.error);
          return;
        }

        const releasesData = data.releases || [];
        setReleases(releasesData);
        setFilteredReleases(releasesData);
      } catch (err) {
        console.error('Error fetching releases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  // Filter releases based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredReleases(releases);
    } else {
      const filtered = releases.filter(release =>
        release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.cpu.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReleases(filtered);
    }
  }, [searchQuery, releases]);

  // Get releases to display
  const getDisplayReleases = () => {
    if (searchQuery) {
      return filteredReleases;
    }
    return showAll ? releases : releases.slice(0, 4);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const extractYouTubeId = (url: string) => {
    if (!url) return null;
    console.log('YouTube URL:', url);
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/user\/[^\/]+\/.*#(?:p\/)?(?:a\/)?(?:u\/\d+\/)?(?:[^\/]*\/)?([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        const id = match[1].substring(0, 11); // YouTube IDs are always 11 characters
        console.log('Extracted ID:', id);
        console.log('Thumbnail URL:', `https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
        return id;
      }
    }
    
    console.log('No YouTube ID found');
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Search Bar Skeleton */}
        <div className="max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <div className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full bg-gray-200 animate-pulse h-12"></div>
          </div>
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse h-full">
              <div className="bg-gray-200 aspect-video rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No OS releases available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-lg mx-auto">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
          </div>
          <input
            type="text"
            placeholder="Search OS releases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-0 focus:border-primary focus:bg-white transition-all duration-300 placeholder-gray-400 hover:border-gray-300 hover:bg-white"
          />
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="text-center text-sm text-gray-600">
          {filteredReleases.length} release{filteredReleases.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Releases Grid - Show top 4 or filtered results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getDisplayReleases().map((release) => {
        const youtubeId = extractYouTubeId(release.youtube_link);
        console.log('Final youtubeId:', youtubeId);
        console.log('YouTube link:', release.youtube_link);
        
        return (
          <div key={release.id} className="group cursor-pointer">
            <Link href={`/${release.route}`} className="block">
              <div className="card p-4 card-hover h-full flex flex-col">
                {/* Video Thumbnail */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-3">
                  {youtubeId ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                        alt={`${release.name} preview`}
                        fill
                        className="object-cover"
                        onLoad={() => console.log('Thumbnail loaded successfully')}
                        onError={(e) => {
                          console.log('Maxres thumbnail failed, trying hqdefault');
                          e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                          e.currentTarget.onerror = () => {
                            console.log('HQ thumbnail failed, trying default');
                            e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/default.jpg`;
                          };
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 group-hover:scale-110 shadow-2xl">
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <Play className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <p className="text-xs">Video Preview</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Compact Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {release.name}
                  </h3>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(release.release_date)}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="btn-primary w-full text-center text-sm py-2">
                      Get Access
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
         );
       })}
      </div>

      {/* View All Button - Show when there are more than 4 releases and no search */}
      {!searchQuery && releases.length > 4 && !showAll && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(true)}
            className="btn-secondary px-6 py-2"
          >
            View All {releases.length} Releases
          </button>
        </div>
      )}

      {/* Show Less Button - When showing all releases */}
      {!searchQuery && showAll && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(false)}
            className="btn-secondary px-6 py-2"
          >
            Show Less
          </button>
        </div>
      )}

      {/* No Results Message */}
      {searchQuery && filteredReleases.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No releases found matching &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-2 text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
