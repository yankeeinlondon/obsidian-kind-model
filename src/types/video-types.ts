export interface GetYoutubeVideosResponse {
  expected: {

    /**
     * the `type` -- if any -- which is associated with YouTube videos
     */
    type: string | undefined;

    /**
     * the `kind` -- if any -- which is associated with YouTube videos
     */
    kind: string | undefined;

    /**
     * the `category` -- if any -- which is associated with
     * YouTube videos.
     */
    category: string | undefined;
  };

  page: {
    /** Page Name */
    name: string;

  };

  /**
   * The YouTube video links found on the specified page
   */
  videos: string[];
}
