import {Box, Toolbar} from '@mui/material';
import {useRouter} from 'next/router';
import {createContext, useContext, useEffect, useMemo, useRef, useState} from 'react';
import type {PropsWithChildren, ReactNode} from 'react';

import {Drawer} from './components/drawer';
import {DrawersBox} from './components/drawers_box';

export type DrawerSide = 'left' | 'right';

export type DrawerProps = PropsWithChildren<{
  side: DrawerSide;
  name?: string;
  withBlur?: boolean;
  hidden?: boolean;
}>;

export type DrawersState = {
  opened: DrawerSide | null;
  openedName: string | null;
  show: (drawer: DrawerProps) => void;
  hide: (side?: DrawerSide) => void;
};

export type DrawersProps = PropsWithChildren<{
  withoutPadding?: boolean;
  footer?: ReactNode;
  header?: ReactNode;
  defaultOpened?: DrawerProps;
}>;

const DrawersContext = createContext<DrawersState>({show: () => {}, hide: () => {}, opened: null, openedName: null});

/**
 * Используется для отображения боковых меню
 *
 * Состоит из 2 методов: show и hide.
 * Метод show открывает боковое меню с выбранной стороны DrawerSide и отображает переданный children внутри Drawer, при этом уменьшается размер доступного блока
 * Метод hide закрывает боковое меню
 */
export const useDrawers = () => useContext(DrawersContext);

export const DrawersContextProvider = ({withoutPadding, children, footer, header, defaultOpened}: DrawersProps) => {
  const router = useRouter();

  const [leftDrawer, setLeftDrawer] = useState<DrawerProps | null>(
    defaultOpened?.side === 'left' ? defaultOpened : null,
  );
  const [rightDrawer, setRightDrawer] = useState<DrawerProps | null>(
    defaultOpened?.side === 'right' ? defaultOpened : null,
  );
  const [openedName, setOpenedName] = useState<string | null>(defaultOpened?.name ?? null);

  const opened: DrawerSide | null = useMemo(() => {
    switch (true) {
      case !!leftDrawer:
        return 'left';
      case !!rightDrawer:
        return 'right';
      default:
        return null;
    }
  }, [leftDrawer, rightDrawer]);

  const leftDrawerWidth: number = useMemo(() => 286, []);
  const rightDrawerWidth: number = useMemo(() => 448, []);

  const marginLeft: number = useMemo(
    () => (!!leftDrawer && leftDrawer.hidden !== true ? leftDrawerWidth : 0),
    [leftDrawer, leftDrawerWidth],
  );
  const marginRight: number = useMemo(
    () => (!!rightDrawer && rightDrawer.hidden !== true ? rightDrawerWidth : 0),
    [rightDrawer, rightDrawerWidth],
  );

  const defaultPadding: string = useMemo(() => (withoutPadding ? '0px' : '24px'), [withoutPadding]);

  const routerPath = useRef<string>(router.route);

  // Используется для того, чтобы убрать меню при навигации
  useEffect(() => {
    if (routerPath.current !== router.route) {
      hide();
      routerPath.current = router.route;
    }
  }, [router.route]);

  const show = async (drawer: DrawerProps) => {
    await hide(null, drawer.name);

    switch (drawer.side) {
      case 'left':
        setLeftDrawer(drawer);
        break;
      case 'right':
        setRightDrawer(drawer);
        break;
    }
  };

  const hide = async (side?: DrawerSide | null, openedName?: string | undefined | null) => {
    setOpenedName(openedName ?? null);

    switch (side) {
      case 'left':
        await hideDrawer(leftDrawer, setLeftDrawer);
        break;
      case 'right':
        await hideDrawer(rightDrawer, setRightDrawer);
        break;
      default:
        await hideDrawer(leftDrawer, setLeftDrawer);
        await hideDrawer(rightDrawer, setRightDrawer);
        break;
    }
  };

  const hideDrawer = async (drawer: DrawerProps | null, setDrawer: (drawer: DrawerProps | null) => void) => {
    if (!drawer) return;

    setDrawer({...drawer, hidden: true});

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        setDrawer(null);
      }, 600);
    });
  };

  return (
    <DrawersContext.Provider value={{show, hide, opened, openedName}}>
      <Box sx={styles.container}>
        {header && (
          <>
            {header}
            <Toolbar />
          </>
        )}

        <Drawer side="left" drawer={leftDrawer} width={leftDrawerWidth} />
        <Drawer side="right" drawer={rightDrawer} width={rightDrawerWidth} />

        <DrawersBox marginLeft={marginLeft} marginRight={marginRight}>
          <Box
            flex={1}
            overflow="auto"
            paddingLeft={{xs: '0', md: defaultPadding}}
            paddingTop={{xs: '0', md: defaultPadding}}>
            {children}
          </Box>
          {footer && (
            <Box sx={styles.footer}>
              <Box sx={styles.footerContent}>{footer}</Box>
            </Box>
          )}
        </DrawersBox>
      </Box>
    </DrawersContext.Provider>
  );
};

const styles: Styles = {
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #DEDEDE',
    width: '100%',
    padding: {xs: '8px 16px', md: '12px 24px'},
  },
  footerContent: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'relative',
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
};
