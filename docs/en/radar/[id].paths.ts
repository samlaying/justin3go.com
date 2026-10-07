import { radarItems } from "../../.vitepress/theme/utils/radarList";

export default {
	paths: radarItems.map(item => ({ params: { id: item.id } })),
};
