import { createSwitchNavigator, createAppContainer} from 'react-navigation';
import MainActivity from './activities/mainActivity';
import SecondActivity from './activities/secondActivity';

export default createAppContainer(

  createSwitchNavigator(

      {
        Main: MainActivity,
        Second: SecondActivity
      },
      
      {
        intialRouteName: 'Main'
      }

  )
  
)