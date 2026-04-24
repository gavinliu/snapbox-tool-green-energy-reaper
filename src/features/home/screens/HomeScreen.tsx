import * as Automation from "@snapbox/pkg-automation";
import * as FloatingMenu from "@snapbox/pkg-floating-menu";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConfigStore } from "../../config/store/useConfigStore";
import { CollectionFab } from "../components/CollectionFab";

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isConfigComplete = useConfigStore((state) => state.isConfigComplete);

  const [overlayStatus, requestOverlayPermission] =
    FloatingMenu.useOverlayPermissions();
  const [automationStatus, requestAutomationPermission] =
    Automation.useAutomationPermissions();

  return (
    <View style={styles.root}>
      <View
        style={{ ...styles.listContainer, marginBottom: insets.bottom + 80 }}
      >
        <Card mode="contained">
          <Card.Title
            title="悬浮窗权限"
            subtitle="通过悬浮窗，快速启停采集器"
            left={(props) => <Avatar.Icon {...props} icon="toaster" />}
          />
          <Card.Content style={styles.cardContent}>
            {overlayStatus?.granted ? (
              <Button icon="check" mode="text" onPress={() => {}}>
                已授权
              </Button>
            ) : (
              <Button
                icon="play"
                mode="contained"
                onPress={requestOverlayPermission}
              >
                授权
              </Button>
            )}
          </Card.Content>
        </Card>

        <Card mode="contained">
          <Card.Title
            title="自动化权限"
            subtitle="通过自动化，自动采集绿色能量"
            left={(props) => (
              <Avatar.Icon {...props} icon="cursor-default-click" />
            )}
          />
          <Card.Content style={styles.cardContent}>
            {automationStatus?.granted ? (
              <Button icon="check" mode="text" onPress={() => {}}>
                已授权
              </Button>
            ) : (
              <Button
                icon="play"
                mode="contained"
                onPress={requestAutomationPermission}
              >
                授权
              </Button>
            )}
          </Card.Content>
        </Card>

        <Card mode="contained">
          <Card.Title
            title="模板匹配"
            subtitle={"通过模板匹配图，在屏幕中查找点击位置"}
            left={(props) => <Avatar.Icon {...props} icon={"cog"} />}
          />
          <Card.Content style={styles.cardContent}>
            {isConfigComplete ? (
              <Button icon="check" onPress={() => router.push("/config")}>
                已配置
              </Button>
            ) : (
              <Button
                icon="plus"
                mode="contained"
                onPress={() => router.push("/config")}
              >
                开始配置
              </Button>
            )}
          </Card.Content>
        </Card>

        <Card mode="contained">
          <Card.Title
            title="教程"
            subtitle="使用前，请仔细阅读教程"
            left={(props) => (
              <Avatar.Icon {...props} icon="information-outline" />
            )}
          />
          <Card.Content>
            <Text>1. 完成上面的权限授权和配置</Text>
            <Text>2. 点击采集按钮</Text>
            <Text style={{ marginLeft: 16 }}>2.1. 请求授权录屏</Text>
            <Text style={{ marginLeft: 16 }}>2.2. 自动显示悬浮菜单</Text>
            <Text style={{ marginLeft: 16 }}>2.3. 自动打开蚂蚁森林</Text>
            <Text>3. 点击悬浮菜单上的采集按钮，启动自动采集</Text>
            <Text>4. 采集过程中切勿操作手机</Text>
          </Card.Content>
        </Card>
      </View>

      <CollectionFab />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  listContainer: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardContent: {
    flexWrap: "wrap",
    gap: 8,
  },
});
