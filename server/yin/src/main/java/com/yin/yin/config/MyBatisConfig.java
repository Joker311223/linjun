package com.yin.yin.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis配置类
 */
@Configuration
@MapperScan("com.yin.yin.mapper")
public class MyBatisConfig {
    // MyBatis的其他配置已在application.properties中完成
}
