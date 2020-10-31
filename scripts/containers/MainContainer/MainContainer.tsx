import React from "react";

interface MainContainerProps {
	children: React.ReactNode
}

const MainContainer = ({ children }: MainContainerProps): JSX.Element => {
	return (
		<main className="main">
			{ children }
		</main>
	);
};

export default MainContainer;