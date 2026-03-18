import { Flex, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { ThemePicker } from "./ThemePicker";

export function Header() {
	return (
		<header style={{ borderBottom: "1px solid var(--gray-6)" }}>
			<Flex align="center" justify="between" py="3" px="4">
				<Link to="/" style={{ textDecoration: "none" }}>
					<Text size="5" weight="bold">
						Todo App
					</Text>
				</Link>
				<Flex gap="4" align="center">
					<ThemePicker />
				</Flex>
			</Flex>
		</header>
	);
}
