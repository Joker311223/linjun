package com.yin.yin.model;

import lombok.Data;

/**
 * 套餐类型实体类
 */
@Data
public class PackageType {
    /**
     * 类型ID
     */
    private Integer id;

    /**
     * 类型名称
     */
    private String name;

    /**
     * 类型编码
     */
    private String code;
}
