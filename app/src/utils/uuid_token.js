import { v4 as uuidv4 } from "uuid";
// 生成随机字符串，持久存储
export const getUUID = () => {
	// 从本地存储获取uuid
	let uuid_token = localStorage.getItem("UUIDTOKEN");
	if (!uuid_token) {
		uuid_token = uuidv4();
		localStorage.setItem("UUIDTOKEN", uuid_token);
	}
	// 返回数据，存储于store
	return uuid_token;
};
