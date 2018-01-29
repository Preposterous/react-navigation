import { I18nManager } from 'react-native';

import getSceneIndicesForInterpolationInputRange from '../../utils/getSceneIndicesForInterpolationInputRange';

/**
 * Utility that builds the style for the navigation header.
 *
 * +-------------+-------------+-------------+
 * |             |             |             |
 * |    Left     |   Title     |   Right     |
 * |  Component  |  Component  | Component   |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

function hasHeader(scene) {
  if (!scene) {
    return true;
  }
  const { screenDescriptor } = scene;
  return screenDescriptor.options.headerVisible !== false;
}

function isGoingBack(scenes) {
  const lastSceneIndexInScenes = scenes.length - 1;
  return !scenes[lastSceneIndexInScenes].isActive;
}

function forLayout(props) {
  const { layout, position, scene, scenes } = props;
  const isBack = isGoingBack(scenes);

  const interpolate = getSceneIndicesForInterpolationInputRange(props);
  if (!interpolate) return {};

  const { first, last } = interpolate;
  const index = scene.index;

  const width = layout.initWidth;

  const translateX = position.interpolate({
    inputRange: [first, index, last],
    outputRange: I18nManager.isRTL
      ? [-width, 0, width]
      : [
          hasHeader(scenes[first]) ? 0 : width,
          hasHeader(scenes[index]) ? 0 : isBack ? width : -width,
          hasHeader(scenes[last]) ? 0 : -width,
        ],
  });

  return {
    transform: [{ translateX }],
  };
}

function forLeft(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;

  const inputRange = [
    first,
    first + 0.01,
    first + Math.abs(index - first) / 2,
    index,
    last - Math.abs(last - index) / 2,
    last - 0.01,
    last,
  ];
  const outputRange = [
    0,
    hasHeader(scenes[first]) ? 0 : 1,
    hasHeader(scenes[first]) ? 0 : 1,
    hasHeader(scenes[index]) ? 1 : 0,
    hasHeader(scenes[last]) ? 0 : 1,
    hasHeader(scenes[last]) ? 0 : 1,
    0,
  ];

  return {
    opacity: position.interpolate({
      inputRange,
      outputRange,
    }),
  };
}

function forCenter(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };

  const { first, last } = interpolate;
  const index = scene.index;
  const inputRange = [first, first + 0.01, index, last - 0.01, last];
  const opacityOutputRange = [
    0,
    hasHeader(scenes[first]) ? 0 : 1,
    hasHeader(scenes[index]) ? 1 : 0,
    hasHeader(scenes[last]) ? 0 : 1,
    0,
  ];

  const translateXOutputRange = I18nManager.isRTL
    ? [
        -200,
        hasHeader(scenes[first]) ? -200 : 0,
        0,
        hasHeader(scenes[last]) ? 200 : 0,
        200,
      ]
    : [
        200,
        hasHeader(scenes[first]) ? 200 : 0,
        0,
        hasHeader(scenes[last]) ? -200 : 0,
        -200,
      ];

  return {
    opacity: position.interpolate({
      inputRange,
      outputRange: opacityOutputRange,
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange,
          outputRange: translateXOutputRange,
        }),
      },
    ],
  };
}

function forRight(props) {
  const { position, scene, scenes } = props;
  const interpolate = getSceneIndicesForInterpolationInputRange(props);

  if (!interpolate) return { opacity: 0 };
  const { first, last } = interpolate;
  const index = scene.index;
  const inputRange = [first, first + 0.01, index, last - 0.01, last];
  const outputRange = [
    0,
    hasHeader(scenes[first]) ? 0 : 1,
    hasHeader(scenes[index]) ? 1 : 0,
    hasHeader(scenes[last]) ? 0 : 1,
    0,
  ];

  return {
    opacity: position.interpolate({
      inputRange,
      outputRange,
    }),
  };
}

export default {
  forLayout,
  forLeft,
  forCenter,
  forRight,
};
