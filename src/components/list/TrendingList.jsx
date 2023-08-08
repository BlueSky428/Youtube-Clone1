import React, { useContext, useEffect, useState } from "react";
import { Grid, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import numeral from "numeral";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

import YoutubeContext from "../../context/YoutubeContext";
import SearchSkeleton from "../layout/SearchSkeleton";
import { errorhandling } from "../../utils/utils";
import SearchVideoCard from "../cards/SearchVideoCard";

const TrendingList = () => {
  const {
    trendingVideos,
    country,
    getTrendingVideos,
    isLoading,
    setIsLoading,
    setTrendingVideos,
    trendingVideosLength,
  } = useContext(YoutubeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setNextPageToken("");
    getTrendingVideos();
  }, [country]);

  const [nextPageToken, setNextPageToken] = useState("");

  // Trending videos Scrolling
  const fetchMoreData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=${country}&key=AIzaSyCSg8WrqSPJ475M6NEebNrztvnEgSfosgc&maxResults=15&pageToken=${nextPageToken}`
      );

      const newNextPageToken = res.data.nextPageToken;

      const res2 = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=${country}&key=AIzaSyCSg8WrqSPJ475M6NEebNrztvnEgSfosgc&maxResults=15&pageToken=${newNextPageToken}`
      );
      setTrendingVideos((prevTrendingVideos) => [
        ...prevTrendingVideos,
        ...res2.data.items,
      ]);
      setIsLoading(false);

      setNextPageToken(() => newNextPageToken);
    } catch (error) {
      errorhandling(error);
    }
  };

  return (
    <>
      <InfiniteScroll
        dataLength={trendingVideos.length} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={
          trendingVideosLength > trendingVideos.length + 1 ? true : false
        }
        loader={
          isLoading ? (
            <Grid gap={5} padding={"30px"}>
              <>
                <SearchSkeleton />
                <SearchSkeleton />
                <SearchSkeleton />
              </>
            </Grid>
          ) : (
            ""
          )
        }
        endMessage={
          <Text color={"white"} textAlign={"center"} padding={"20px"}>
            <b>👍 Yay! You have seen it all</b>
          </Text>
        }
      >
        <>
          <Grid gap={5} padding={"30px"}>
            {trendingVideos &&
              trendingVideos.map((video) => (
                <SearchVideoCard
                  videoId={video.id}
                  channelId={video?.snippet?.channelId}
                  duration={
                    video.contentDetails?.duration
                      ? durationConverter(video.contentDetails?.duration)
                      : ""
                  }
                  key={video.id}
                  title={
                    video.snippet?.title
                      ? formateTitle(convertHtmlEntities(video.snippet.title))
                      : ""
                  }
                  thumbnail={
                    video?.snippet.thumbnails?.maxres?.url ||
                    video?.snippet.thumbnails?.standard?.url ||
                    ""
                  }
                  avatar={""}
                  postTime={timeConverter(video.snippet.publishedAt)}
                  views={viewsConverter(video.statistics.viewCount)}
                  channelName={video.snippet.channelTitle}
                />
              ))}
            {trendingVideosLength > trendingVideos.length + 1 ? (
              <>
                <SearchSkeleton />
                <SearchSkeleton />
                <SearchSkeleton />
              </>
            ) : (
              ""
            )}
          </Grid>
        </>
      </InfiniteScroll>
    </>
  );
};

export default TrendingList;

// Views
const viewsConverter = (views) => {
  const formattedViews = numeral(views).format("0.[00]a");

  return formattedViews;
};

// Convert HTML entities in title
function convertHtmlEntities(inputString) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = inputString;
  return textarea.value;
}

// Video Duration
const durationConverter = (duration) => {
  const matches = duration.match(/PT(?:(\d+)M)?(\d+)S/);
  if (!matches) return "";

  const minutes = parseInt(matches[1]) || 0;
  const seconds = parseInt(matches[2]) || 0;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Video Uploaded
const timeConverter = (time) => {
  const date = new Date(time);
  return formatDistanceToNow(date, { addSuffix: true });
};

// Video Title
const formateTitle = (title) => {
  const char = title.split("");

  if (char.length < 100) {
    return title;
  }

  return `${char.slice(0, 100).join("")}...`;
};
