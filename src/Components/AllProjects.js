import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

const AllProjects = ({ allProjects, getAllEvents }) => {
	return (
		<Box>
			<Typography variant="h6">Your Projects</Typography>
			<Divider />
			<Box>
				{allProjects.map((allProjectsMap) => {
					return (
						<Box
							sx={{ cursor: "pointer" }}
							onClick={() => getAllEvents(allProjectsMap)}
						>
							<Stack direction="row" mt={4}>
								<FolderRoundedIcon sx={{ color: "#F8D775" }} />
								<Typography ml={2}>{allProjectsMap.projectName}</Typography>
							</Stack>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

export default AllProjects;
