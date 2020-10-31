import React from "react";

const UnAuthConteiner = (props: any) => {

	return (
		<div className="content">
			<div>
                you are not authorized
            </div>
			<div>
				{ props.children }
            </div>
		</div>
	);
};

export default UnAuthConteiner;