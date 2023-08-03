import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

const VideoCard = ({
  thumbnail,
  title,
  avatar,
  postTime,
  views,
  channelName,
  duration,
}) => {
  return (
    <>
      <NavLink to="/">
        <Box>
          <Box
            borderRadius={"8px"}
            position={"relative"}
            backgroundRepeat={"no-repeat"}
            height={"180px"}
            backgroundImage={thumbnail}
            backgroundSize={"cover"}
            backgroundColor="#2e2c2c"
            backgroundPosition={"center"}
          >
            <Text
              position={"absolute"}
              right={3}
              bottom={3}
              color={"white"}
              background={"black"}
              fontSize={"xs"}
              padding={"3px 8px"}
              borderRadius={"5px"}
            >
              {duration || "0:06:23"}
            </Text>
          </Box>

          <Flex marginTop={"10px"} gap={3}>
            {avatar ? (
              <Image
                height={"35px"}
                borderRadius={"100%"}
                src={avatar}
                alt="channel"
              />
            ) : (
              <Avatar
                size={"sm"}
                name={channelName}
                src="https://bit.ly/tioluwani-kolawole"
              />
            )}

            <Box color={"white"}>
              <Text fontWeight={"semibold"}>{title}</Text>
              <Text marginTop={"5px"} fontSize={"xs"}>
                {channelName}
              </Text>
              <Text fontSize={"xs"} display={"inline"}>
                {views ? views + " " + "Views" : ""}
              </Text>{" "}
              <Text display={"inline"} fontSize={"xs"}>
                {postTime}
              </Text>
            </Box>
          </Flex>
        </Box>
      </NavLink>
    </>
  );
};

export default VideoCard;
