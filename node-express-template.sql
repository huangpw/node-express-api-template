/*
 Navicat Premium Data Transfer

 Source Server         : 本地数据库
 Source Server Type    : MySQL
 Source Server Version : 80030
 Source Host           : localhost:3306
 Source Schema         : node-express-template

 Target Server Type    : MySQL
 Target Server Version : 80030
 File Encoding         : 65001

 Date: 23/03/2024 19:58:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户名',
  `password` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '密码',
  `nick_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `sex` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '性别',
  `email` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `mobile` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号码',
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像',
  `status` tinyint(0) NULL DEFAULT NULL COMMENT '状态  0：禁用   1：正常',
  `role` bigint(0) NULL DEFAULT NULL COMMENT '角色   1：管理  101：运营  999：用户',
  `create_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `last_update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '更新人',
  `last_update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'admin', '$2a$10$4knOPeM2ON87KJR8tF0H1..GKaXjDwMgnaNRPo6GQI3gf6Zhmnkle', '用户fR6OX', '男', '1042850644@qq.com', '13232722996', '/default/1.jpg', 1, 1, NULL, '2024-03-17 19:56:57', 'admin', '2024-03-17 23:25:57');
INSERT INTO `sys_user` VALUES (2, 'huangpw', '$2a$10$EAldNp4EDi2hbMKe8NKD8ueQX49jXVvKZB4aoYCQgq8AzR9Hr1A3.', '用户hIGq7', NULL, '1042850645@qq.com', NULL, '/default/1.jpg', 1, 1, NULL, '2024-03-17 21:18:23', NULL, NULL);
INSERT INTO `sys_user` VALUES (3, 'huangpw2', '$2a$10$Fie7PSwi/ito4SEddtuzUeWW0DM1ae4Qg2DpnW0UCuBLbqvS5PmVm', '用户n-cum', NULL, '1042850646@qq.com', NULL, '/default/1.jpg', 1, 1, NULL, '2024-03-17 21:23:07', NULL, NULL);

-- ----------------------------
-- Table structure for sys_verify_code
-- ----------------------------
DROP TABLE IF EXISTS `sys_verify_code`;
CREATE TABLE `sys_verify_code`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `verify_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '验证类型',
  `verify_account` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '验证账号',
  `verify_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '验证编码',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_verify_code
-- ----------------------------
INSERT INTO `sys_verify_code` VALUES (1, 'mobile', '13232722996', '189591', '2024-03-17 23:44:43');
INSERT INTO `sys_verify_code` VALUES (2, 'email', '1042850644@qq.com', '123456', '2024-03-17 23:19:03');
INSERT INTO `sys_verify_code` VALUES (3, 'email', '1042850644@qq.com', 'HTTLst', '2024-03-18 00:26:55');
INSERT INTO `sys_verify_code` VALUES (4, 'mobile', '13232722996', '288248', '2024-03-18 00:26:59');

SET FOREIGN_KEY_CHECKS = 1;
