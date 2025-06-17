import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Assurances from './Assurances';
import Compte from './Compte';
import ExploreScreen from './HomeScreen';
import Sinistres from './Sinistres';

import TabBar from '../../../components/TabBar';

const Tab = createBottomTabNavigator();

export default function TabsNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="ExploreScreen" component={ExploreScreen} options={{ title: "Explorer" }} />
      <Tab.Screen name="Assurances" component={Assurances} options={{ title: "Mes assurances" }} />
      <Tab.Screen name="Sinistres" component={Sinistres} options={{ title: "Mes sinistres" }} />
      <Tab.Screen name="Compte" component={Compte} options={{ title: "Compte" }} />
    </Tab.Navigator>
  );
}