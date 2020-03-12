import tippy, {createSingleton} from 'tippy.js/headless';
import TippyGenerator from './Tippy';
import useSingletonGenerator from './useSingleton';
import forwardRef from './forwardRef';

const useSingleton = useSingletonGenerator(createSingleton);

export default forwardRef(TippyGenerator(tippy), {render: () => ''});
export {useSingleton, tippy};
