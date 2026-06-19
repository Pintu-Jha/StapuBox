import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Text,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';


interface AppLoaderProps {
  fullScreen?: boolean;
  message?: string;
  visible?: boolean;
  testID?: string;
}

const AppLoader: React.FC<AppLoaderProps> = ({
  fullScreen = false,
  message,
  visible = true,
  testID,
}) => {
  if (!visible) {
    return null;
  }

  const spinner = (
    <View style={fullScreen ? styles.fullScreenInner : styles.inline}>
      <ActivityIndicator
        size={fullScreen ? 'large' : 'small'}
        color={Colors.accent}
        testID={testID ?? 'app-loader'}
      />
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}
    </View>
  );

  if (fullScreen) {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        statusBarTranslucent
      >
        <View style={styles.overlay}>{spinner}</View>
      </Modal>
    );
  }

  return spinner;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenInner: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.md,
    minWidth: 120,
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  message: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default React.memo(AppLoader);
