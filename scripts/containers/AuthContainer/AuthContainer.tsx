import React from "react";
import NavBar from '../../components/NavBar/NavBar';
import Aside from '../../components/Aside/Aside';
import MainContainer from "../MainContainer/MainContainer";

interface AuthContainerProps {
	children: React.ReactNode,
	currentBlock: null | string
}

const AuthContainer = ({ children, currentBlock }: AuthContainerProps): JSX.Element => {
	
	return (
		<div className="content">
			<NavBar currentBlock={currentBlock} />
			<MainContainer>
				{ children }
			</MainContainer>
			<Aside />
		</div>
	);
};

export default AuthContainer;